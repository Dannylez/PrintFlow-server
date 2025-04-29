import OrderFields from '../models/orderFields.js';

const createFields = async (req, res) => {
	try {
		const newOrderFields = await OrderFields.create(
			req.body
		);
		return res.status(200).json({
			message: 'Fields creada correctamente!',
			newOrderFields,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear Fields',
			error,
		});
	}
};

const updateFields = async (req, res) => {
	const { id } = req.params;

	try {
		const fieldsToUpdate = await OrderFields.findById(id);
		if (!fieldsToUpdate) {
			return res.status(404).json({
				message: 'Fields que estás buscando no existe',
			});
		}

		const updatedFields =
			await OrderFields.findByIdAndUpdate(id, req.body, {
				new: true,
			});
		return res.status(200).json({
			message: 'Fields actualizado!',
			fieldsToUpdate,
			updatedFields,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar información',
			error,
		});
	}
};

export default { createFields, updateFields };
