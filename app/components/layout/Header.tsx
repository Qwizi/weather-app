import { Cloud } from "lucide-react"
import Link from "next/link"

export const Header = () => {
    return (
        <header className="header">
            <Link href="/" className="flex items-center gap-3">
                <div className="size-10 glass-panel rounded-full flex items-center justify-center shadow-glow">
                    <Cloud />
                </div>

                <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">Weather App</h1>
                
            </Link>

        </header>
    )
}