// components/DogList.tsx
import Link from "next/link";
import { DogBreed } from "../types/DogBreed";

export default function DogList({ breeds }: { breeds: DogBreed[] }) {
  return (
    <ul className="space-y-4 p-4">
      {breeds.map((breed) => (
        <Link key={breed.id} href={`/breeds/${breed.id}`}>
          <li className="border p-4 rounded-lg hover:bg-yellow-100 cursor-pointer">
            <h2 className="text-xl font-bold">{breed.name}</h2>
            <p>{breed.description}</p>
          </li>
        </Link>
      ))}
    </ul>
  );
}