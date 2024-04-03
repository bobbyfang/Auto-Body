import {
    GridCellModesModel,
    GridCellParams,
    GridCellModes,
    DataGrid,
} from "@mui/x-data-grid";
import { useCallback, useState } from "react";

export default function SingleClickDataGrid({
    rows,
    columns,
    processRowUpdate,
    processRowUpdateError,
    slots,
    slotProps,
}) {
    const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>(
        {}
    );

    const handleCellClick = useCallback(
        (params: GridCellParams, event: React.MouseEvent) => {
            if (!params.isEditable) {
                return;
            }
            //Ignore portal
            if (
                (event.target as any).nodeType === 1 &&
                !event.currentTarget.contains(event.target as Element)
            ) {
                return;
            }

            setCellModesModel((prevModel) => {
                return {
                    // Revert the mode of other cells from other rows
                    ...Object.keys(prevModel).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: Object.keys(prevModel[id]).reduce(
                                (acc2, field) => ({
                                    ...acc2,
                                    [field]: { mode: GridCellModes.View },
                                }),
                                {}
                            ),
                        }),
                        {}
                    ),
                    [params.id]: {
                        // Revert the mode of other cells in the same row
                        ...Object.keys(prevModel[params.id] || {}).reduce(
                            (acc, field) => ({
                                ...acc,
                                [field]: { mode: GridCellModes.View },
                            }),
                            {}
                        ),
                        [params.field]: { mode: GridCellModes.Edit },
                    },
                };
            });
        },
        []
    );

    const handleCellModesModelchange = useCallback(
        (newModel: GridCellModesModel) => {
            setCellModesModel(newModel);
        },
        []
    );

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            hideFooter={true}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModesModelchange}
            onCellClick={handleCellClick}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={processRowUpdateError}
            slots={slots}
            slotProps={slotProps}
            disableColumnMenu
        ></DataGrid>
    );
}
