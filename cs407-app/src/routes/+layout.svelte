<script>
	import 'bootstrap/dist/css/bootstrap.css';
	import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
	import Header from './Header.svelte';
	import './styles.css';
</script>
<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>

<div class="app offset-1">
	<Header />
	<main>
		<slot />
	</main>
	<hr class="space-above" />

	<footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		padding-top: 0rem;
		width: 100%;
		/* max-width: 64rem; */
		/* margin: 0 auto; */
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}

	.space-below {
		margin-top: 5px;
		margin-bottom: 20px;
	}

	.space-above {
		margin-top: 20px;
		margin-bottom: 5px;
	}
</style>
