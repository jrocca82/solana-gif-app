import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MyProject } from "../target/types/my_project";
const { SystemProgram } = anchor.web3;

describe("my-project", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());

	const program = anchor.workspace.MyProject as Program<MyProject>;

	it("Is initialized!", async () => {
		const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
		const baseAccount = anchor.web3.Keypair.generate();
		const tx = await program.methods
			.initialize()
			.accounts({
				baseAccount: baseAccount.publicKey,
				user: publicKey,
				systemProgram: SystemProgram.programId,
			})
			.signers([baseAccount])
			.rpc();
		console.log("Your transaction signature", tx);

		let account = await program.account.baseAccount.fetch(
			baseAccount.publicKey
		);
		console.log("👀 GIF Count", account.totalGifs.toString());

		await program.methods
			.addGif(
				"https://i.kym-cdn.com/photos/images/newsfeed/000/724/681/8c7.gif"
			)
			.accounts({
				baseAccount: baseAccount.publicKey,
				user: publicKey
			})
			.rpc();
		account = await program.account.baseAccount.fetch(baseAccount.publicKey);
		console.log("👀 GIF Count", account.totalGifs.toString());
    console.log('👀 GIF List', account.gifList);
	});
});
