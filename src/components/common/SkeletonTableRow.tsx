import { Skeleton, TableCell, TableRow } from "@mui/material";

interface SkeletonTableRowProps {
  cellCount: number;
  rowCount?: number;
}

const SkeletonTableRow = ({cellCount, rowCount }:SkeletonTableRowProps) => {
   const rows = Array(rowCount).fill(0);
  const cells = Array(cellCount).fill(0);

  return (
    <>
      {rows.map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {cells.map((_, cellIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
              <Skeleton 
                animation="wave"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default SkeletonTableRow