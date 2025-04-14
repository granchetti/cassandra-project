import { Router, Request, Response } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "./index";

const router = Router();

router.post("/users", async (req: Request, res: Response) => {
  const { username, name, age } = req.body;
  try {
    const userId = await createUser(username, name, age);
    res.status(201).json({ userId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await getUser(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

router.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { name, age } = req.body;
    await updateUser(userId, name, age);
    res.status(200).json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// Endpoint para eliminar un usuario
router.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await deleteUser(userId);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
