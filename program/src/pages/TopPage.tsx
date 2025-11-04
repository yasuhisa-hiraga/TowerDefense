import { Link } from "react-router";

function TopPage(){

	return (
		<>
		<div className="w-64 mx-auto">
			<h1 className="text-3xl p-12">Tower Defense</h1>
			<Link to={`/game/`} >
				<p className="bg-black text-white rounded-md p-4 hover:bg-gray-400">Click to Start</p>
			</Link>
			<p>created by lemo</p>
		</div>
		</>
	)
}

export default TopPage;