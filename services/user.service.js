"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

let roles = ['admin','reseller','account_manager','enduser'];
/** @type {ServiceSchema} */
module.exports = {
	name: "user",


	hooks: {
        before: {
			// Define a global hook for all actions
			"*": "resolveLoggedUser",
		},
		after:{

		}
	},
	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],



	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		create: {
			auth:"required",
			rest: {
				method: "POST",
				path: "/create"
			},
			params: {
				first_name: "string",
				last_name: "string",
				username: "string",
				password: "string",
				role: "string"
			},
			async handler(ctx) {
				console.log(ctx.meta);
				console.log(ctx.meta.user);
				//admin token can create x role

				return ctx.meta.user.role +" token can create "+ctx.params.role;
			}
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string"
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		async resolveLoggedUser(ctx) {
			console.log(ctx.params.role);
			console.log(ctx.meta.user.role);
			console.log(roles);
			if(roles.indexOf(ctx.params.role) === -1){
				throw new Error("Forbidden")
			}
			
			//Admin
			// if ctx.meta.user.role == admin then ctx.params.role can not be admin
			if(ctx.meta.user.role === 'admin' && ctx.params.role === 'admin'){
				throw new Error("Forbidden");
			}

			//Reseller
			// if ctx.meta.user.role == reseller then ctx.params.role can not be admin and reseller
			if(ctx.meta.user.role === 'reseller' && (ctx.params.role !== 'enduser')){
				throw new Error("Forbidden");
			}

			//Account Manager
			// if ctx.meta.user.role == reseller then ctx.params.role can not be admin and reseller
			if(ctx.meta.user.role === 'account_manager' && (ctx.params.role==='admin' || ctx.params.role==='reseller' || ctx.params.role==='account_manager' ||  ctx.params.role==='enduser')){
				throw new Error("Forbidden");
			}

			//EndUser
			// if ctx.meta.user.role == reseller then ctx.params.role can not be admin and reseller
			if(ctx.meta.user.role === 'enduser' && (ctx.params.role==='admin' || ctx.params.role==='reseller' || ctx.params.role==='account_manager' || ctx.params.role==='enduser')){
				throw new Error("Forbidden");
			}
        }
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
