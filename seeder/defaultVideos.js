import { Videos } from "../models/model.js";

export const seedVideos = async () => {
	try {
		const count = await Videos.count();
		if (count > 0) {
			console.log("ℹ️ Videos table already has data.");
			return;
		}

		const videoData = [
			{
				title: "Theseus and the Minotaur",
				link: "https://www.youtube.com/embed/xQuAUBX5xBw?si=G1xdGOmHwjzrKFlv",
			},
			{
				title: "Looney Tunes | Baby Wile E. Coyote and Baby Road Runner",
				link: "https://www.youtube.com/embed/gnaKp_mlcFQ?si=t1VOTV6IxfbHehbk",
			},
			{
				title: "BLUEY | Mum and Dad Try to Escape",
				link: "https://www.youtube.com/embed/0CTxpt6Mwm8?si=6S0WdkfK2lONtbOt",
			},
			{
				title: "Baby Looney Tunes | Scary Night",
				link: "https://www.youtube.com/embed/db2dW4i-SYA?si=bESCjSpeQFVvKZ-7",
			},
			{
				title: "Mermaid Rescue | Sofia The First",
				link: "https://www.youtube.com/embed/0czvQIZz09E?si=6h-HUd91kjoKM-Ja",
			},
			{

				title: "Kids exercise 5 minutes easy workout for Kids with Hip-po",
				link: "https://www.youtube.com/embed/ISzEpUjB9XA?si=yxf91ZtAR7nlK7-H",
			},
			{
				title: "The Wind and the Sun",
				link: "https://www.youtube.com/embed/l0Z8A4u3CtI?si=s9P9KJaTUlLRhDF8",
			},
			{
				title: "The City Mouse and the Country Mouse",
				link: "https://www.youtube.com/embed/Atkt-vhxFIc?si=68m-sOa-pBrVlaUg",
			},
			{
				title: "The Bear and the Bee",
				link: "https://www.youtube.com/embed/jKi2SvWOCXc?si=ryC3LDnoxIG-Khur",
			},
			{
				title: "TIDE TALES - The Great Underwater Race",
				link: "https://www.youtube.com/embed/3d8ZGPvrxa8?si=2J0N0BAp2MMlvh0p",
			},
		];

		await Videos.bulkCreate(videoData);
		console.log("✅ Seeded Videos table successfully.");
	} catch (error) {
		console.error("❌ Error seeding Videos table:", error);
	}
};
