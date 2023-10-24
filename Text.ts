
namespace HtmlFeedExampleServer
{
	const txtgen = require("./txtgen") as typeof import("txtgen");
	
	/** */
	export namespace Text
	{
		/** */
		export function word(cap?: "cap")
		{
			const nouns = txtgen.getNouns();
			const noun = nouns[Math.floor(Math.random() * nouns.length)];
			return cap ? noun.slice(0, 1).toUpperCase() + noun.slice(1) : noun;
		}
		
		/** */
		export function phrase(count = 3)
		{
			const words = [Text.word("cap")];
			
			for (let i = -1; ++i < count - 1;)
				words.push(Text.word());
			
			return words.join(" ");
		}
		
		/** */
		export function paragraph(sentenceCount = 1)
		{
			return txtgen.paragraph(sentenceCount);
		}
	}
}