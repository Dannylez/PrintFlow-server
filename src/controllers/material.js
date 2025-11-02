import Material from '../models/material.js';

const getAllMaterials = async (req, res) => {
	try {
		const materials = await Material.find().sort({
			name: 1,
		});

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

const getFilteredMaterials = async (req, res) => {
	const {
		page = 1,
		searchTerm = '',
		limit = 50,
	} = req.query;

	let query = {};
	let count;

	try {
		if (searchTerm) {
			query = {
				$or: [
					{
						name: { $regex: searchTerm, $options: 'i' },
					},
					{
						type: { $regex: searchTerm, $options: 'i' },
					},
				],
			};
		}

		count = await Material.countDocuments(query);

		const materials = await Material.find(query)
			.sort({ materialNumber: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ name: 1 });

		return res.status(200).json({
			materials,
			count,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error al obtener las órdenes',
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
			message: 'Material actualizado!',
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

const bulksUpdateMaterialPrices = async (req, res) => {
  const factor = Number(String(req.query.factor ?? '').replace(',', '.'));
  if (!Number.isFinite(factor)) {
    return res.status(400).json({ message: 'Debes enviar un factor numérico' });
  }

  try {
    const result = await Material.updateMany(
      {},
      [
        {
          $set: {
            pricePerUnitType: {
              $let: {
                vars: {
                  numVal: {
                    $toDouble: {
                      // normaliza coma -> punto ANTES de parsear
                      $replaceAll: {
                        input: '$pricePerUnitType',
                        find: ',',
                        replacement: '.',
                      },
                    },
                  },
                },
                in: {
                  // multiplica * factor y redondea a 2; SIEMPRE devuelve string con punto
                  $toString: {
                    $round: [{ $multiply: ['$$numVal', factor] }, 2],
                  },
                },
              },
            },
          },
        },
      ]
    );

    return res.status(200).json({
      message: `Precios actualizados correctamente (factor ${factor}).`,
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar precios de materiales', error });
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
	getFilteredMaterials,
	getMaterialById,
	createMaterial,
	bulksUpdateMaterialPrices,
	updateMaterial,
	deleteMaterial,
	deleteAll,
};
