/**
 * Competency Controller
 * Handles HTTP requests for competency and certificate endpoints
 */

const competencyService = require('./competencyService');

class CompetencyController {
  /**
   * GET /competencies
   * Get all available competencies
   */
  async getAllCompetencies(req, res) {
    try {
      const competencies = await competencyService.getAllCompetencies();
      res.json(competencies);
    } catch (error) {
      console.error('Error fetching competencies:', error);
      res.status(500).json({ error: 'Failed to fetch competencies' });
    }
  }

  /**
   * GET /competencies/:id
   * Get a specific competency by ID
   */
  async getCompetencyById(req, res) {
    try {
      const { id } = req.params;
      const competency = await competencyService.getCompetencyById(id);
      
      if (!competency) {
        return res.status(404).json({ error: 'Competency not found' });
      }
      
      res.json(competency);
    } catch (error) {
      console.error('Error fetching competency:', error);
      res.status(500).json({ error: 'Failed to fetch competency' });
    }
  }

  /**
   * POST /competencies
   * Create a new competency (Admin only)
   */
  async createCompetency(req, res) {
    try {
      const competencyData = req.body;
      const newCompetency = await competencyService.createCompetency(competencyData);
      res.status(201).json(newCompetency);
    } catch (error) {
      console.error('Error creating competency:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create competency' });
    }
  }

  /**
   * GET /competencies/user/:userId
   * Get user's achieved competencies
   */
  async getUserCompetencies(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      const competencies = await competencyService.getUserCompetencies(userId);
      res.json(competencies);
    } catch (error) {
      console.error('Error fetching user competencies:', error);
      res.status(500).json({ error: 'Failed to fetch user competencies' });
    }
  }

  /**
   * GET /certificates
   * Get current user's certificates
   */
  async getUserCertificates(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const certificates = await competencyService.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }

  /**
   * POST /certificates
   * Issue a certificate to a user (Admin only)
   */
  async issueCertificate(req, res) {
    try {
      const { userId, competencyId } = req.body;
      
      if (!userId || !competencyId) {
        return res.status(400).json({ error: 'userId and competencyId are required' });
      }
      
      const certificate = await competencyService.issueCertificate(userId, competencyId);
      res.status(201).json(certificate);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      res.status(500).json({ error: 'Failed to issue certificate' });
    }
  }

  /**
   * GET /certificates/:id/download
   * Download certificate PDF
   */
  async downloadCertificate(req, res) {
    try {
      const { id } = req.params;
      
      // TODO: Implement PDF generation and download
      // For now, return a placeholder response
      res.status(501).json({ 
        error: 'PDF generation not yet implemented',
        message: 'This feature will generate and download a PDF certificate'
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      res.status(500).json({ error: 'Failed to download certificate' });
    }
  }
}

module.exports = new CompetencyController();
