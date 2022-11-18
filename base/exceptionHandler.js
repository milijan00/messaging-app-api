//Errors
class NotFoundError extends Error{
	entity = null;
	id = null;
	constructor(entity, id){
		super();
		this.entity = entity;
		this.id = id;
	}

}

class InternalServerError extends Error{
	constructor(){
		super();
	}
}
class UnprocessableEntityError extends Error{
	errors = null;
	constructor(errors){
		super();
		this.errors = errors;
	}
}

class ErrorHandler{
	handleError(error, res){
		if(error instanceof Error.NotFoundError){
			return  res.status(404).json({entity: error.entity, id: error.id});
		}

		if(error instanceof Error.UnprocessableEntityError){
			return  res.status(404).json({errors : error.errors});
		}
		return res.sendStatus(500);
	}
}
module.exports.Errors = {
	InternalServerError,
	UnprocessableEntityError,
	NotFoundError
};

module.exports = ErrorHandler;