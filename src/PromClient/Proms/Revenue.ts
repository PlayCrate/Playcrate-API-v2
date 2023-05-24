import prom from 'prom-client';

const productRobux = new prom.Gauge({
	name: 'bubble_product_robux',
	help: 'Robux Spent on Product',
});

const gamepassRobux = new prom.Gauge({
	name: 'bubble_gamepass_robux',
	help: 'Robux Spent on Gamepass',
});

export { productRobux, gamepassRobux };
