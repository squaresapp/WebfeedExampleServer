
namespace HtmlFeedExampleServer
{
	const Http = require("http") as typeof import("http");
	const Fs = require("fs") as typeof import("fs");
	const Path = require("path") as typeof import("path");
	
	/** */
	export function startup()
	{
		const server = Http.createServer((req, res) =>
		{
			if (req.url === "/favicon.ico" || !req.url || !req.url.startsWith("/"))
				return res.end();
			
			const fileName = req.url.slice(1).split("?")[0];
			
			if (fileName === "index.html" || fileName === "")
			{
				res.writeHead(200, {
					"content-type": "text/html"
				});
				
				res.end(readStaticFile("index.html"));
			}
			else if (fileName === "avatar.jpg")
			{
				res.writeHead(200, {
					"content-type": "image/jpeg"
				});
				
				res.write(readStaticFile("avatar.jpg"));
			}
			else if (fileName === "add-post")
			{
				let feedContent = readStaticFile("index.txt").toString("utf8");
				const feedLines = feedContent.split("\n");
				
				while (feedLines.length > 0 && feedLines[0] === "")
					feedLines.shift();
				
				const postName = "post-" + (feedLines.length + 1);
				feedLines.push("post-" + (feedLines.length + 1));
				feedContent = feedLines.join("\n");
				writeStaticFile("index.txt", feedContent);
				
				res.writeHead(200, {
					"content-type": "text/html",
				});
				
				res.end(`Added post: <a href="/${postName}" target="_blank">/${postName}</a>`);
			}
			else if (fileName === "clear-feed")
			{
				writeStaticFile("index.txt", "");
				
				const fullPath = Path.join(process.cwd(), "static");
				const contents = Fs.readdirSync(fullPath);
				
				for (const dirName of contents)
					if (dirName.startsWith("post-"))
						Fs.rmSync(Path.join(fullPath, dirName), { force: true, recursive: true });
				
				res.writeHead(200, {
					"content-type": "text/html",
				});
				
				res.end(`Feed-cleared`);
			}
			else if (fileName === "index.txt")
			{
				let feedContent = readStaticFile("index.txt").toString("utf8");
				
				res.writeHead(200, {
					"content-type": "text/plain",
					"content-length": feedContent.length
				});
				
				if (req.method === "HEAD")
					res.end();
				
				else if (req.method === "GET")
					res.end(feedContent);
			}
			else if (/^post-\d+(\/|\/index\.html)?$/.test(fileName))
			{
				res.writeHead(200, {
					"content-type": "text/html"
				});
				
				const staticPath = 
					fileName + 
					(fileName.endsWith("/index.html") ? "" : "/index.html");
				
				const indexHtml = readStaticFile("template.html")
					.toString("utf8")
					.replaceAll("{hue}", Math.round(Math.random() * 360).toString())
					.replace("{section1}", Text.phrase(3))
					.replace("{section2}", Text.paragraph(1))
					.replace("{section3}", Text.paragraph(2));
				
				writeStaticFile(staticPath, indexHtml);
				res.end(indexHtml);
			}
		});
		
		server.listen(12345);
		
		console.log("");
		console.log("HTML Feed server listening at address: http://localhost:12345");
		console.log("");
	}
	
	/** */
	function readStaticFile(path: string)
	{
		const fullPath = Path.join(process.cwd(), "static", path);
		const file = Fs.readFileSync(fullPath);
		return file;
	}
	
	/** */
	function writeStaticFile(path: string, contents: string | Buffer)
	{
		const fullPath = Path.join(process.cwd(), "static", path);
		const fullDir = Path.dirname(fullPath);
		Fs.mkdirSync(fullDir, { recursive: true });
		Fs.writeFileSync(fullPath, contents);
	}
	
	setTimeout(() => startup());
}
