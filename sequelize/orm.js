export class ORM {
	constructor(model) {
		this.model = model;
	}

	async list(filter = {}) {
		return this.model.findAll({
			where: filter
		});
	}

	async deleteAll() {
		await this.model.destroy({
			where: {}
		});
	}

	async clearData() {
		await this.model.truncate({cascade: true});
	}

	async findByPrimary(primary) {
		return this.model.findByPk(primary);
	}

	async update(obj, diff) {
		await this.model.update(diff);
	}

	async insert(data) {
		await this.model.create(data);
	}

	async count() {
		return await this.model.count();
	}

	async lastID() {
		return await this.model.max('id');
	}
}