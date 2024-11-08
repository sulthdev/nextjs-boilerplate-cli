// TODO: Change this file according to your exact requirement.

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header>
        <h1>Global Layout</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
