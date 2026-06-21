// finopsProviderInterface.js
// Interface defining the abstraction layer for cost metrics and recommendations

class FinOpsProviderInterface {
  /**
   * Fetch current cloud cost metrics
   * @returns {Promise<Object>}
   */
  async getCosts() {
    throw new Error('Method getCosts() must be implemented.');
  }

  /**
   * Fetch or generate cost optimization recommendations
   * @returns {Promise<Array>}
   */
  async getRecommendations(costMetricsString) {
    throw new Error('Method getRecommendations() must be implemented.');
  }
}

module.exports = FinOpsProviderInterface;
