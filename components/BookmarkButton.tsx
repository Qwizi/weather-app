import { addFavorite, FavoriteCity, removeFavorite } from "@/store/favoritesSlice";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import gsap from "gsap";

interface BookmarkButtonProps {
    isFavorite?: boolean;
    cityObj?: FavoriteCity;
}

export default function BookmarkButton({ isFavorite, cityObj }: BookmarkButtonProps) {
    const dispatch = useDispatch();
    const btnRef = useRef<HTMLButtonElement>(null);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (btnRef.current) {
            gsap.fromTo(
                btnRef.current,
                { scale: 1 },
                { scale: 1.25, duration: 0.13, yoyo: true, repeat: 1, ease: "power1.inOut" }
            );
        }
        if (!isFavorite && cityObj && btnRef.current) {
            setTimeout(() => dispatch(addFavorite(cityObj)), 350);
        } else if (isFavorite && cityObj) {
            dispatch(removeFavorite(cityObj));
        }
    };
    return (
        <button
            ref={btnRef}
            className={`size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-2 ${isFavorite ? 'text-amber-500' : 'text-slate-400'} cursor-pointer`}
            title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            onClick={handleClick}
        >
            {isFavorite ? <BookmarkCheck /> : <Bookmark />}
        </button>
    )
}