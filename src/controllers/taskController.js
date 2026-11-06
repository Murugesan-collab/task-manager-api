const pool = require("../config/db");

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, status || "TODO", req.user.id],
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      tasks: result.rows,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, status, id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
