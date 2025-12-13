export async function GET() {
	const body =
		'Coming soon: nextjs api route that renders the given markdown text as html including mermaid diagrams as svgs'
	return new Response(body, {
		status: 200,
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
