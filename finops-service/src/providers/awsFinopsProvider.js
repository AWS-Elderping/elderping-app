// awsFinopsProvider.js
// AWS Cost Explorer implementation of FinOps provider

const FinOpsProviderInterface = require('./finopsProviderInterface');
const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');

class AwsFinOpsProvider extends FinOpsProviderInterface {
  constructor() {
    super();
    const awsRegion = process.env.AWS_REGION || 'us-east-1';
    try {
      this.ceClient = new CostExplorerClient({ region: awsRegion });
    } catch (err) {
      console.error('⚠️ AwsFinOpsProvider failed to initialize CostExplorerClient:', err.message);
      this.ceClient = null;
    }
  }

  async getCosts() {
    if (!this.ceClient) {
      throw new Error('AWS CostExplorerClient not initialized.');
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = now.toISOString().split('T')[0];
    const command = new GetCostAndUsageCommand({
      TimePeriod: { Start: start, End: end },
      Granularity: 'MONTHLY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
    });

    const data = await this.ceClient.send(command);
    return data.ResultsByTime || [];
  }

  async getRecommendations(costMetricsString) {
    // Generate recommendations using Bedrock / AI-service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://ai-service:3000';
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    let recommendationText = 'Consolidate workloads and enable scaling limits.';
    try {
      const response = await fetch(`${aiServiceUrl}/ai/finops-recs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ costMetricsString })
      });
      if (response.ok) {
        const aiData = await response.json();
        recommendationText = aiData.recommendation;
      }
    } catch (err) {
      console.error('⚠️ Failed to fetch AI recommendations from provider:', err.message);
    }

    return [
      {
        recommendation_date: new Date().toISOString().split('T')[0],
        category: 'Infrastructure',
        finding: 'Aggregated resource utilization checks',
        action_item: recommendationText,
        potential_savings: 45.00,
        is_applied: false
      }
    ];
  }
}

module.exports = AwsFinOpsProvider;
