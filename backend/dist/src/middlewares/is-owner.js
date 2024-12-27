"use strict";
/**
 * `is-owner` middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (config, { strapi }) => {
    // Add your own logic here.
    return async (ctx, next) => {
        strapi.log.info("In is-owner middleware.");
        const entryId = ctx.params.id;
        const user = ctx.state.user;
        const userId = user === null || user === void 0 ? void 0 : user.documentId;
        if (!userId)
            return ctx.unauthorized(`You can't access this entry`);
        const apiName = ctx.state.route.info.apiName;
        function generateUID(apiName) {
            const apiUid = `api::${apiName}.${apiName}`;
            return apiUid;
        }
        const appUid = generateUID(apiName);
        if (entryId) {
            const entry = await strapi.documents(appUid).findOne({
                documentId: entryId,
                populate: "*",
            });
            if (entry && entry.authorId !== userId)
                return ctx.unauthorized(`You can't access this entry`);
        }
        if (!entryId) {
            ctx.query = {
                ...ctx.query,
                filters: { ...ctx.query.filters, authorId: userId },
            };
        }
        await next();
    };
};
