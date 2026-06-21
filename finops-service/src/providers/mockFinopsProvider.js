// mockFinopsProvider.js
// Mock implementation of FinOpsCostProvider

const FinOpsProviderInterface = require('./finopsProviderInterface');

class MockFinOpsProvider extends FinOpsProviderInterface {
  async getCosts() {
    return {
      billingPeriod: 'Current Month (Mock)',
      eks_cost: 142.50,
      rds_cost: 84.20,
      bedrock_cost: 28.10,
      cloudwatch_cost: 12.45,
      sns_cost: 4.80,
      ses_cost: 1.20,
      total_cost: 273.25
    };
  }

  async getRecommendations(costMetricsString) {
    return [
      {
        recommendation_date: new Date().toISOString().split('T')[0],
        category: 'Infrastructure (Mock)',
        finding: 'Aggregated resource utilization checks (Mock)',
        action_item: 'Consolidate workloads and enable scaling limits (Mock).',
        potential_savings: 45.00,
        is_applied: false
      }
    ];
  }
}

module.exports = MockFinOpsProvider;
