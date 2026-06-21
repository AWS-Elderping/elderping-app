// finopsModel.js
// Data layer for FinOps PostgreSQL operations

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const FinOpsModel = {
  async getDailyCosts(limit = 30) {
    const result = await pool.query(
      'SELECT * FROM finops_daily_costs ORDER BY billing_date DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async getCachedRecommendations(limit = 10) {
    const result = await pool.query(
      'SELECT * FROM finops_recommendations WHERE is_applied = FALSE ORDER BY recommendation_date DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async cacheRecommendation({ date, category, finding, actionItem, potentialSavings }) {
    const result = await pool.query(
      `INSERT INTO finops_recommendations (recommendation_date, category, finding, action_item, potential_savings)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, category, finding, actionItem, potentialSavings]
    );
    return result.rows[0];
  },

  async applyRecommendation(id) {
    const result = await pool.query(
      'UPDATE finops_recommendations SET is_applied = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  async insertDailyCost({ billingDate, eks, rds, bedrock, cloudwatch, sns, ses, other, total }) {
    const result = await pool.query(
      `INSERT INTO finops_daily_costs 
        (billing_date, eks_cost, rds_cost, bedrock_cost, cloudwatch_cost, sns_cost, ses_cost, other_cost, total_cost)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (billing_date)
       DO UPDATE SET
         eks_cost = EXCLUDED.eks_cost,
         rds_cost = EXCLUDED.rds_cost,
         bedrock_cost = EXCLUDED.bedrock_cost,
         cloudwatch_cost = EXCLUDED.cloudwatch_cost,
         sns_cost = EXCLUDED.sns_cost,
         ses_cost = EXCLUDED.ses_cost,
         other_cost = EXCLUDED.other_cost,
         total_cost = EXCLUDED.total_cost
       RETURNING *`,
      [billingDate, eks, rds, bedrock, cloudwatch, sns, ses, other, total]
    );
    return result.rows[0];
  },

  getPool() {
    return pool;
  }
};

module.exports = FinOpsModel;
