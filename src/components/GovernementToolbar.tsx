import {
  Card,
  Typography,
  Box,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useMemo } from "react";
import theme from "../styles/mainThem";

export interface Government {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface GovernmentToolbarProps {
  selectedGovernment: string;
  onGovernmentChange: (governmentId: string) => void;
  governments: Government[];
}

const GovernmentToolbar = ({
  selectedGovernment,
  onGovernmentChange,
  governments,
}: GovernmentToolbarProps) => {
  const [internalSearch, setInternalSearch] = useState("");

  // Filter governments based on search term
  const filteredGovernments = useMemo(() => {
    if (!internalSearch.trim()) return governments;
    
    const searchLower = internalSearch.toLowerCase();
    return governments.filter(gov => 
      gov.name.toLowerCase().includes(searchLower) ||
      gov.description.toLowerCase().includes(searchLower)
    );
  }, [governments, internalSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(event.target.value);
  };

  const handleSearchClear = () => {
    setInternalSearch("");
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 1 }}>
          المحافظات
        </Typography>
        
        {/* Search Bar */}
        <TextField
          placeholder="ابحث عن محافظة..."
          value={internalSearch}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: internalSearch && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleSearchClear}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Government Cards */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            overflowX: "auto", 
            p: 1,
            minHeight: 100,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.grey[100],
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[400],
              borderRadius: 3,
            },
          }}
        >
          {/* All Governments Option */}
          <GovernmentCard
            id="all"
            selectedId={selectedGovernment}
            onClick={onGovernmentChange}
            title="كل المحافظات"
            description="عرض جميع المحافظات"
          />
          
          {/* No Government Option */}
          <GovernmentCard
            id="none"
            selectedId={selectedGovernment}
            onClick={onGovernmentChange}
            title="غير محدد"
            description="بدون محافظة"
          />

          {/* Filtered Government Cards */}
          {filteredGovernments.length > 0 ? (
            filteredGovernments.map((gov) => (
              <GovernmentCard
                key={gov.id}
                id={gov.id.toString()}
                selectedId={selectedGovernment}
                onClick={onGovernmentChange}
                title={gov.name}
                description={gov.description}
              />
            ))
          ) : (
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 200,
                backgroundColor: theme.palette.grey[50],
                border: `1px dashed ${theme.palette.grey[300]}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {internalSearch ? "لا توجد نتائج للبحث" : "لا توجد محافظات"}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default GovernmentToolbar;

interface GovernmentCardProps {
  id: string;
  selectedId: string;
  onClick: (id: string) => void;
  title: string;
  description?: string;
}

const GovernmentCard = ({ 
  id, 
  selectedId, 
  onClick, 
  title, 
  description 
}: GovernmentCardProps) => {
  const isSelected = selectedId === id;

  return (
    <Paper
      onClick={() => onClick(id)}
      elevation={isSelected ? 3 : 1}
      sx={{
        minWidth: 160,
        maxWidth: 200,
        height:80,
        p: 2,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        border: `2px solid ${
          isSelected ? theme.palette.primary.main : "transparent"
        }`,
        borderRadius: 2,
        backgroundColor: isSelected
          ? theme.palette.primary.light + "10" // شفافية 10%
          : "background.paper",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: 600,
          textAlign: "right",
          color: isSelected ? theme.palette.primary.dark : "text.primary",
          mb: 0.5,
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: "right",
            color: "text.secondary",
            lineHeight: 1.4,
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>
      )}
      
      {/* Selection Indicator */}
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 4,
            height: "100%",
            backgroundColor: theme.palette.primary.main,
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
          }}
        />
      )}
    </Paper>
  );
};
