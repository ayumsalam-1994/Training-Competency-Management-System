const db = require('../utils/db');

/**
 * Competency Service
 * Handles all business logic for competency management
 * Uses real database queries via db.js helper functions
 */
class CompetencyService {
  /**
   * Get all competencies from the database
   * @returns {Promise<Array>} Array of competency objects
   */
  async getAllCompetencies() {
    try {
      const competencies = await db.getAllCompetencies();
      return competencies;
    } catch (error) {
      console.error('Error fetching competencies:', error);
      throw new Error('Failed to fetch competencies');
    }
  }

  /**
   * Get a specific competency by ID
   * @param {number} id - Competency ID
   * @returns {Promise<Object|null>} Competency object or null if not found
   */
  async getCompetencyById(id) {
    try {
      const competency = await db.getCompetencyById(id);
      return competency;
    } catch (error) {
      console.error('Error fetching competency:', error);
      throw new Error('Failed to fetch competency');
    }
  }

  /**
   * Create a new competency
   * @param {Object} competencyData - Competency data
   * @param {string} competencyData.name - Competency name
   * @param {string} competencyData.description - Competency description
   * @param {string} competencyData.level - Competency level (beginner/intermediate/advanced)
   * @returns {Promise<Object>} Created competency with insertId
   */
  async createCompetency(competencyData) {
    try {
      const { name, description, level } = competencyData;
      const result = await db.createCompetency(name, description, level);
      return {
        id: result.insertId,
        name,
        description,
        level,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error creating competency:', error);
      throw new Error('Failed to create competency');
    }
  }

  /**
   * Get all competencies for a specific user with progress
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user competency objects with progress
   */
  async getUserCompetencies(userId) {
    try {
      const competencies = await db.getUserCompetencies(userId);
      return competencies;
    } catch (error) {
      console.error('Error fetching user competencies:', error);
      throw new Error('Failed to fetch user competencies');
    }
  }

  /**
   * Get all certificates for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of certificate objects
   */
  async getUserCertificates(userId) {
    try {
      const certificates = await db.getUserCertificates(userId);
      return certificates;
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      throw new Error('Failed to fetch user certificates');
    }
  }

  /**
   * Issue a certificate to a user for completing a competency
   * @param {number} userId - User ID
   * @param {number} competencyId - Competency ID
   * @param {Date} expiresAt - Certificate expiry date (optional)
   * @returns {Promise<Object>} Created certificate object
   */
  async issueCertificate(userId, competencyId, expiresAt = null) {
    try {
      const result = await db.issueCertificate(userId, competencyId, expiresAt);
      return {
        id: result.insertId,
        user_id: userId,
        competency_id: competencyId,
        issued_at: new Date(),
        expires_at: expiresAt
      };
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw new Error('Failed to issue certificate');
    }
  }

  /**
   * Assign a competency to a user
   * @param {number} userId - User ID
   * @param {number} competencyId - Competency ID
   * @param {string} proficiencyLevel - Proficiency level (beginner/intermediate/advanced/expert)
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Created user_competency record
   */
  async assignCompetencyToUser(userId, competencyId, proficiencyLevel = 'beginner', notes = null) {
    try {
      // Validate proficiency level
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validLevels.includes(proficiencyLevel)) {
        proficiencyLevel = 'beginner';
      }
      
      const result = await db.assignCompetencyToUser(userId, competencyId, proficiencyLevel, notes);
      return {
        id: result.insertId || result.id,
        user_id: userId,
        competency_id: competencyId,
        proficiency_level: proficiencyLevel,
        notes: notes,
        achieved_at: new Date()
      };
    } catch (error) {
      console.error('Error assigning competency to user:', error);
      throw new Error('Failed to assign competency to user');
    }
  }

  /**
   * Update a user's proficiency level for a competency
   * @param {number} userId - User ID
   * @param {number} competencyId - Competency ID
   * @param {string} proficiencyLevel - New proficiency level (beginner/intermediate/advanced/expert)
   * @returns {Promise<Object>} Update result
   */
  async updateUserCompetencyLevel(userId, competencyId, proficiencyLevel) {
    try {
      // Validate proficiency level
      const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validLevels.includes(proficiencyLevel)) {
        throw new Error('Invalid proficiency level. Must be: beginner, intermediate, advanced, or expert');
      }
      
      const success = await db.updateUserCompetencyLevel(userId, competencyId, proficiencyLevel);
      return {
        success: success,
        userId: userId,
        competencyId: competencyId,
        proficiencyLevel: proficiencyLevel
      };
    } catch (error) {
      console.error('Error updating user competency level:', error);
      throw error;
    }
  }

  /**
   * Get competency statistics for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Stats object with counts and levels
   */
  async getUserCompetencyStats(userId) {
    try {
      const [competencies, certificates] = await Promise.all([
        this.getUserCompetencies(userId),
        this.getUserCertificates(userId)
      ]);

      const totalCompetencies = competencies.length;
      // Consider 'advanced' and 'expert' as achieved/mastered
      const masteredCompetencies = competencies.filter(c => 
        c.proficiency_level === 'expert' || c.proficiency_level === 'advanced'
      ).length;
      // Beginner and intermediate are in progress
      const inProgressCompetencies = competencies.filter(c => 
        c.proficiency_level === 'beginner' || c.proficiency_level === 'intermediate'
      ).length;
      const totalCertificates = certificates.length;

      // Calculate a progress score (beginner=25, intermediate=50, advanced=75, expert=100)
      const levelScores = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
      const totalScore = competencies.reduce((sum, c) => sum + (levelScores[c.proficiency_level] || 0), 0);
      const averageProgress = totalCompetencies > 0 ? Math.round(totalScore / totalCompetencies) : 0;

      return {
        totalCompetencies,
        masteredCompetencies,
        inProgressCompetencies,
        totalCertificates,
        averageProgress
      };
    } catch (error) {
      console.error('Error fetching user competency stats:', error);
      throw new Error('Failed to fetch competency statistics');
    }
  }

  /**
   * Generate a certificate download (PDF generation placeholder)
   * @param {number} certificateId - Certificate ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Certificate data for PDF generation
   */
  async getCertificateForDownload(certificateId, userId) {
    try {
      const certificates = await this.getUserCertificates(userId);
      const certificate = certificates.find(c => c.id === certificateId);
      
      if (!certificate) {
        throw new Error('Certificate not found or access denied');
      }

      // Return certificate data that can be used for PDF generation
      return {
        ...certificate,
        downloadReady: true,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error fetching certificate for download:', error);
      throw error;
    }
  }
}

module.exports = new CompetencyService();
