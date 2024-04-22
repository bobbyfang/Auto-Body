import {
    GridCellModesModel,
    GridCellParams,
    GridCellModes,
    DataGrid,
    GridSlotsComponent,
    GridColDef,
    DataGridProps,
    GridInputRowSelectionModel,
    GridRowIdGetter,
} from "@mui/x-data-grid";
import {
    GridSlotsComponentsProps,
    UncapitalizeObjectKeys,
} from "@mui/x-data-grid/internals";
import { useCallback, useState } from "react";

export default function SingleClickDataGrid({
    rows,
    columns,
    getRowId = (row) => row.id,
    processRowUpdate,
    processRowUpdateError,
    selectionModel,
    selectionModelChange,
    slots,
    slotProps,
    hideFooter,
    props,
}: {
    rows?: readonly any[];
    columns?: readonly GridColDef<any>[];
    getRowId?: GridRowIdGetter<any>;
    processRowUpdate?: (newRow: any, oldRow: any) => any;
    processRowUpdateError?: (error: any) => void;
    selectionModelChange?: (newValue: any) => void;
    selectionModel?: GridInputRowSelectionModel;
    slots?: UncapitalizeObjectKeys<Partial<GridSlotsComponent>> | undefined;
    slotProps?: GridSlotsComponentsProps | undefined;
    props?: DataGridProps;
    hideFooter?: boolean;
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
            sx={{ maxHeight: "100%" }}
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            hideFooter={hideFooter}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModesModelchange}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={selectionModelChange}
            onCellClick={handleCellClick}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={processRowUpdateError}
            slots={slots}
            slotProps={slotProps}
            disableColumnMenu
            {...props}
        ></DataGrid>
    );
}
