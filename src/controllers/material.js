import Material from '../models/material.js';

const getAllMaterials = async (req, res) => {
	try {
		const materials = await Material.find();

		return res.status(200).json({
			materials,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener los materiales',
			error,
		});
	}
};

const getMaterialById = async (req, res) => {
	const { id } = req.params;

	try {
		const material = await Material.findById(id);

		if (!material) {
			return res.status(404).json({
				message: 'El material que estás buscando no existe',
			});
		}

		return res.status(200).json({
			material,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener el material',
			error,
		});
	}
};

const createMaterial = async (req, res) => {
	try {
		const newMaterial = await Material.create(req.body);
		return res.status(200).json({
			message: 'Material creado correctamente!',
			newMaterial,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al ingresar material',
			error,
		});
	}
};

const updateMaterial = async (req, res) => {
	const { id } = req.params;
	try {
		const materialToUpdate = await Material.findById(id);
		if (!materialToUpdate) {
			return res.status(404).json({
				message: 'El material que estás buscando no existe',
			});
		}

		const updatedMaterial =
			await Material.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'MAterial actualizado!',
			updatedMaterial,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Error al actualizar material',
			error,
		});
	}
};

const deleteMaterial = async (req, res) => {
	const { id } = req.params;

	try {
		const materialToDelete =
			await Material.findByIdAndDelete(id);
		if (!materialToDelete) {
			return res.status(404).json({
				message: 'El material que estás buscando no existe',
			});
		}

		return res.status(200).json({
			message: 'Material eliminado!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar material',
			error,
		});
	}
};

const deleteAll = async (req, res) => {
	try {
		const result = await Material.deleteMany({});
		return res.status(200).json({
			message: `Se borraron ${result.deletedCount} materiales`,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar materiales',
			error,
		});
	}
};

export default {
	getAllMaterials,
	getMaterialById,
	createMaterial,
	updateMaterial,
	deleteMaterial,
	deleteAll,
};
