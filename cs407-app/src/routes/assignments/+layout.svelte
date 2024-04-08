<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<h1>Assignments</h1>

<div class="submenu">
	{#each data.sections as section}
		<a href="/assignments/{section.slug}">{section.title}</a>
	{/each}
</div>

<slot />
