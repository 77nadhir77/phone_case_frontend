import { Suspense } from "react";
import ThankYou from "./ThankComponent";

const Thankyou = () => {
	return (
		<Suspense>
			<ThankYou />
		</Suspense>
	);
};

export default Thankyou;
