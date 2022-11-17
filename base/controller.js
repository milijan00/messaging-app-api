
module.exports.noParam = (req, param)=>{
	return !req.params[param];
}
