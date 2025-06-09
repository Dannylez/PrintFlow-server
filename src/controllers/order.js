import Order from '../models/order.js';
import clientController from './client.js';

const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			/* .populate('product') */
			.populate('client')
			.populate('stationsList.station');

		return res.status(200).json({
			orders,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las órdenes',
			error,
		});
	}
};

const getOrdersByPage = async (req, res) => {
	const { from = null } = req.query; // El último _id que obtuviste en la página anterior
	const limit = 50; // Queremos obtener de a 50 órdenes

	try {
		// Si se pasó un "lastOrderId", filtra para obtener órdenes más antiguas que ese _id
		const query = from
			? { orderNumber: { $lt: from } }
			: {};

		const count = await Order.countDocuments();

		// Obtener las órdenes más recientes primero, con un límite de 50
		const orders = await Order.find(query)
			.sort({ orderNumber: -1 }) // Ordenar por _id de forma descendente (últimas órdenes primero)
			.limit(limit)
			/* .populate('product') */
			.populate('client')
			.populate('stationsList.station');

		return res.status(200).json({
			from: orders.length
				? orders[orders.length - 1].orderNumber
				: null, // Devuelve el _id de la última orden de la lista
			orders,
			count,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las órdenes',
			error,
		});
	}
};

const getActiveOrders = async (req, res) => {
	const query = {
		status: {
			$in: [
				'Aceptada',
				'Detenida',
				'Para facturar',
				'Para enviar',
			],
		},
	};

	try {
		const orders = await Order.find(query)
			.populate('client')
			.populate('stationsList.station');

		return res.status(200).json({
			orders,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las órdenes',
			error,
		});
	}
};

const getFilteredOrders = async (req, res) => {
	const {
		searchTerm,
		status,
		page = 1,
		limit = 50,
		dateOrder = false,
	} = req.query;

	let query = {};
	let count;

	try {
		if (searchTerm) {
			const clientIds =
				await clientController.getClientIdsByName(
					searchTerm
				);

			query = {
				$or: [
					{
						product: { $regex: searchTerm, $options: 'i' },
					},
					{ client: { $in: clientIds } },
				],
			};
		}

		if (
			status === 'Aceptada' ||
			status === 'Abierta' ||
			status === 'Finalizada' ||
			status === 'Detenida' ||
			status === 'Para facturar' ||
			status === 'Para enviar'
		) {
			query.status = status;
		}

		count = await Order.countDocuments(query);

		let orders = {};

		if (dateOrder) {
			const dateOrders = await Order.aggregate([
				{
					$addFields: {
						statusPriority: {
							$switch: {
								branches: [
									{
										case: { $eq: ['$status', 'Aceptada'] },
										then: 1,
									},
									{
										case: { $eq: ['$status', 'Abierta'] },
										then: 2,
									},
									{
										case: { $eq: ['$status', 'Detenida'] },
										then: 3,
									},
									{
										case: {
											$eq: ['$status', 'Para facturar'],
										},
										then: 4,
									},
									{
										case: {
											$eq: ['$status', 'Para enviar'],
										},
										then: 5,
									},
									{
										case: {
											$eq: ['$status', 'Finalizada'],
										},
										then: 6,
									},
								],
								default: 3,
							},
						},
						hasDateFinal: {
							$cond: [
								{ $ifNull: ['$dateFinal', false] },
								1,
								0,
							],
						},
						hasDateEstimate: {
							$cond: [
								{ $ifNull: ['$dateEstimate', false] },
								1,
								0,
							],
						},
					},
				},
				{
					$sort: {
						statusPriority: 1,
						hasDateFinal: -1, // Los que tienen fecha van primero
						dateFinal: 1, // Ordena por la fecha
						hasDateEstimate: -1, // Lo mismo para fecha estimada
						dateEstimate: 1,
						orderNumber: -1,
					},
				},
				{
					$skip: (page - 1) * limit,
				},
				{
					$limit: limit,
				},
			]);
			orders = await Order.populate(dateOrders, [
				{ path: 'client' },
				{ path: 'stationsList.station' },
			]);
		} else {
			orders = await Order.find(query)
				.sort({ orderNumber: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate('client')
				.populate('stationsList.station');
		}

		return res.status(200).json({
			orders,
			lastOrderNumber: orders.length
				? orders[orders.length - 1].orderNumber
				: null,
			count,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las órdenes',
			error,
		});
	}
};

const getOrderByOrderNumber = async (req, res) => {
	const { orderNumber } = req.params; // Se espera que el número de orden venga en los parámetros de la URL

	try {
		// Busca la orden que tenga el número de orden especificado y hace populate de 'Client' y 'Product'
		const order = await Order.findOne({
			orderNumber,
		}).populate('client'); // Hace populate del cliente // Hace populate del producto
		/* .populate('product') */ // Si no se encuentra la orden
		if (!order) {
			return res.status(404).json({
				message: `No se encontró la orden con el número ${orderNumber}`,
			});
		}

		// Si se encuentra, retornamos la orden
		return res.status(200).json({
			message: 'Orden encontrada!',
			order,
		});
	} catch (error) {
		// En caso de error en la búsqueda
		return res.status(500).json({
			message: 'Error al obtener la orden',
			error,
		});
	}
};

const getOrderById = async (req, res) => {
	const { id } = req.params;

	try {
		const order = await Order.findById(id).populate(
			'fields'
		);

		if (!order) {
			return res.status(404).json({
				message: 'La orden que estás buscando no existe',
			});
		}

		return res.status(200).json({
			order,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener la información',
			error,
		});
	}
};

const createOrder = async (req, res) => {
	const { orderNumber } = req.body;

	try {
		const alreadyExists = await Order.findOne({
			orderNumber,
		});
		if (alreadyExists) {
			return res.status(400).json({
				message: `El número de orden ${req.body.orderNumber} ya está ocupado`,
			});
		}

		const newBody = {
			...req.body,
			dateCreated: new Date(req.body.dateCreated),
			dateEstimate: req.body.dateEstimate
				? new Date(req.body.dateEstimate)
				: null,
			dateFinal: req.body.dateFinal
				? new Date(req.body.dateFinal)
				: null,
		};

		const newOrder = await Order.create(newBody);
		return res.status(200).json({
			message: 'Orden creada correctamente!',
			newOrder,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al crear orden',
			error,
		});
	}
};

const updateOrder = async (req, res) => {
	const { id } = req.params;

	try {
		const orderToUpdate = await Order.findById(id);
		if (!orderToUpdate) {
			return res.status(404).json({
				message: 'La orden que estás buscando no existe',
			});
		}

		/* 		const newBody = {
			...req.body,
			dateEstimate: req.body.dateEstimate
				? new Date(req.body.dateEstimate)
				: null,
			dateFinal: req.body.dateFinal
				? new Date(req.body.dateFinal)
				: null,
		}; */

		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			req.body,
			{
				new: true,
			}
		);
		return res.status(200).json({
			message: 'Orden actualizada!',
			orderToUpdate,
			updatedOrder,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al actualizar información',
			error,
		});
	}
};

const deleteOrder = async (req, res) => {
	const { id } = req.params;

	try {
		const orderToDelete = await Order.findByIdAndDelete(id);
		if (!orderToDelete) {
			return res.status(404).json({
				message: 'La orden que estás buscando no existe',
			});
		}

		return res.status(200).json({
			message: 'Orden eliminada!',
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar orden',
			error,
		});
	}
};

const deleteAll = async (req, res) => {
	try {
		const result = await Order.deleteMany({});
		return res.status(200).json({
			message: `Se borraron ${result.deletedCount} ordenes`,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al eliminar ordenes',
			error,
		});
	}
};

export default {
	getAllOrders,
	getActiveOrders,
	getOrdersByPage,
	getOrderByOrderNumber,
	getFilteredOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
	deleteAll,
};
