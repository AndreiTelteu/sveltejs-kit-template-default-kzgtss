<script context="module">
    /** @type {import('@sveltejs/kit').Load} */
    export function load(params) {
        return {
            props: {
                status: params.status,
                error: params.error,
            },
        };
    }
</script>
<script>
    export let status;
    export let error;
</script>

<svelte:head>
    <title>Error: {status}</title>
</svelte:head>

<h1>Error: {status}</h1>

<pre>{error.stack}</pre>
