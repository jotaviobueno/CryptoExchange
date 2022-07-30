class ResponseHelper {

    async success (res, content) {
      return res.status(200).json(content);
    }

    async created (res, content) {
      return res.status(201).json(content);
    }

    async noContent (res) {
      return res.status(204);
    }

    async badRequest (res, content) {
      return res.status(400).json(content);
    }

    async notAuthorized (res, content) {
      return res.status(401).json(content);
    }

    async notFound (res, content) {
      return res.status(404).json(content);
    }
    
    async unprocessableEntity (res, content) {
      return res.status(422).json(content);
    }
}

export default new ResponseHelper();