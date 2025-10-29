import express from "express";
import { teamService } from "../services/teamService";
import { TeamType } from "../types";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await teamService.getAllTeams();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await teamService.getTeamById(req.params.id);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const teamData: TeamType = {
      name: req.body.name,
      budget: req.body.budget,
      members: req.body.members,
    };

    const result = await teamService.createTeam(teamData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await teamService.updateTeam(req.params.id, req.body);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await teamService.deleteTeam(req.params.id);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      message: "Team deleted successfully",
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
