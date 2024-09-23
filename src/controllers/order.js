import Order from '../models/order.js';
import clientController from './client.js';

const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			/* .populate('product') */
			.populate('client');

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

		// Obtener las órdenes más recientes primero, con un límite de 50
		const orders = await Order.find(query)
			.sort({ orderNumber: -1 }) // Ordenar por _id de forma descendente (últimas órdenes primero)
			.limit(limit)
			/* .populate('product') */
			.populate('client');

		return res.status(200).json({
			from: orders.length
				? orders[orders.length - 1].orderNumber
				: null, // Devuelve el _id de la última orden de la lista
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
		client,
		product,
		status,
		lastOrderNumber = null,
	} = req.query;
	const limit = 50;

	let query = {};

	try {
		// Filtrar por cliente solo si se proporciona un nombre
		if (client) {
			const clientIds =
				await clientController.getClientIdsByName(client);

			if (clientIds.length === 0) {
				return res.status(200).json({ data: [] });
			}
			query.client = { $in: clientIds }; // Buscar órdenes que tengan estos IDs de cliente
		}

		// Filtrar por producto y estado si se proporcionan
		if (product) {
			query['product'] = { $regex: product, $options: 'i' };
		}
		if (status) {
			query.status = status;
		}

		// Si se proporciona lastOrderNumber, obtener órdenes anteriores
		if (lastOrderNumber) {
			query.orderNumber = { $lt: lastOrderNumber };
		}

		// Ejecutar la consulta con los filtros, ordenando y aplicando paginación
		const orders = await Order.find(query)
			.sort({ orderNumber: -1 })
			.limit(limit)
			.populate('client'); // Poblar cliente si necesitas mostrar la información en la respuesta

		return res.status(200).json({
			orders,
			lastOrderNumber: orders.length
				? orders[orders.length - 1].orderNumber
				: null, // Último número de orden para continuar paginación
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
		const order = await Order.findById(id)
			/* .populate('product') */
			.populate('client')
			.populate('comments');

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

		const newOrder = await Order.create(req.body);
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

		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			req.body,
			{
				new: true,
			}
		);
		return res.status(200).json({
			message: 'Orden actualizada!',
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

export default {
	getAllOrders,
	getOrdersByPage,
	getOrderByOrderNumber,
	getFilteredOrders,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
};
