export default function CauseDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="page">
      <h1>Cause: {params.id}</h1>
      <p>Cause detail (API integration in next step).</p>
    </main>
  );
}
