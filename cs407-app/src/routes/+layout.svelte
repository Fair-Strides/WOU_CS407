<script>
	import 'bootstrap/dist/css/bootstrap.css';
	import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
</script>
<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/assignments">Assignments</a>
</nav>

<slot />

<style>
	.space-below {
		margin-top: 5px;
		margin-bottom: 20px;
	}

	.space-above {
		margin-top: 20px;
		margin-bottom: 5px;
	}
</style>
