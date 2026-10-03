export default function AdminHeader({ title, children }) {
  return <div className="block-head"><h1 className="page-title">{title}</h1><div className="btn-row">{children}</div></div>;
}
