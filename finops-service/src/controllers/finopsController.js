// finopsController.js
// Controllers for handling FinOps cost checks and recommendation actions

const FinOpsModel = require('../models/finopsModel');
const { getProvider } = require('../providers/providerRegistry');
const { logAuditEvent } = require('../../shared/auth');

const provider = getProvider();

const getDashboard = async (req, res) => {
  try {
    const costs = await provider.getCosts();
    const history = await FinOpsModel.getDailyCosts(30);
    res.json({ costs, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const cached = await FinOpsModel.getCachedRecommendations(10);
    if (cached.length > 0) {
      return res.json(cached);
    }

    const costs = await provider.getCosts();
    const costsString = JSON.stringify(costs);
    const recs = await provider.getRecommendations(costsString);

    const savedRecs = [];
    for (const rec of recs) {
      const saved = await FinOpsModel.cacheRecommendation({
        date: rec.recommendation_date,
        category: rec.category,
        finding: rec.finding,
        actionItem: rec.action_item,
        potentialSavings: rec.potential_savings
      });
      savedRecs.push(saved);
    }

    res.json(savedRecs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const applyRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FinOpsModel.applyRecommendation(id);
    if (!result) return res.status(404).json({ error: 'Recommendation not found' });
    
    // Asynchronous audit hook
    logAuditEvent(req, {
      actionType: 'APPLY_FINOPS_RECOMMENDATION',
      resource: 'finops_recommendations',
      resourceId: id,
      status: 'SUCCESS',
      message: `FinOps recommendation applied: ${id}`
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recordCosts = async (req, res) => {
  try {
    const { billingDate, eks, rds, bedrock, cloudwatch, sns, ses, other, total } = req.body;
    const result = await FinOpsModel.insertDailyCost({
      billingDate,
      eks: eks || 0.0,
      rds: rds || 0.0,
      bedrock: bedrock || 0.0,
      cloudwatch: cloudwatch || 0.0,
      sns: sns || 0.0,
      ses: ses || 0.0,
      other: other || 0.0,
      total
    });

    // Asynchronous audit hook
    logAuditEvent(req, {
      actionType: 'RECORD_FINOPS_DAILY_COST',
      resource: 'finops_daily_costs',
      resourceId: result.id,
      status: 'SUCCESS',
      message: `Recorded daily cost metric for date: ${billingDate}`
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboard,
  getRecommendations,
  applyRecommendation,
  recordCosts
};
