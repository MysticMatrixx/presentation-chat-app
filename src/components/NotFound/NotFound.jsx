import { Link } from "react-router-dom"

export function NotFound() {
    return (
        <div style={{ textAlign: 'center', fontSize: "1.25rem" }}>
            <h1>Page Not Found : <mark>404</mark></h1>
            <Link to={'/'}> {"< "}Back</Link>
        </div>
    )
}
