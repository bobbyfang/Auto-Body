import { DocumentProps, pdf } from "@react-pdf/renderer";
import printJS from "print-js-updated";
import { ReactElement, JSXElementConstructor } from "react";

export const printPDF = async (
    document:
        | ReactElement<DocumentProps, string | JSXElementConstructor<any>>
        | undefined
) => {
    const blob = await pdf(document).toBlob();
    const url = URL.createObjectURL(blob);
    console.log(url);

    printJS({
        printable: url,
        onLoadingEnd: () => {
            URL.revokeObjectURL(url);
            console.log("end");
        },
        onError: (error) => console.log(error),
        // showModal: true,
    });
};
