import { addFavorite, FavoriteCity, removeFavorite } from "@/store/favoritesSlice";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useDispatch } from "react-redux";

interface BookmarkButtonProps {
    isFavorite?: boolean;
    cityObj?: FavoriteCity;
}

export default function BookmarkButton({ isFavorite, cityObj }: BookmarkButtonProps) {
    const dispatch = useDispatch();
    return (
        <button
            className={`size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-2 ${isFavorite ? 'text-amber-500' : 'text-slate-400'} cursor-pointer`}
            title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            onClick={(e) => {
                e.stopPropagation();
                if (isFavorite && cityObj) {
                    dispatch(removeFavorite(cityObj));
                } else if (cityObj) {
                    dispatch(addFavorite(cityObj));
                }
            }}
        >
            {isFavorite ? <BookmarkCheck /> : <Bookmark />}
        </button>
    )
}