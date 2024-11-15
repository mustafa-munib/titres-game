import TetrisGame from "@/components/tetris/TetrisGame";

export default function Home() {
	return (
		<main className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 flex flex-col gap-4'>
			  <h1 className='text-5xl text-white font-bold flex flex-col items-center gap-3 '>This game has developed  by <span className='text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent '>Mustafa Hussaini</span></h1>
			<TetrisGame />
		</main>
	);
}
