import React from 'react';
import { Form, Badge } from 'react-bootstrap';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const colors = ['primary', 'success', 'warning', 'danger', 'info', 'secondary'];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => (
  <Form className="mb-3 d-flex align-items-center gap-2">
    <Form.Label className="mb-0 me-2">Filter by Category:</Form.Label>
    <Badge
      pill
      bg={selected === '' ? 'dark' : 'light'}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect('')}
      className="me-2"
    >
      All
    </Badge>
    {categories.map((cat, i) => (
      <Badge
        pill
        key={cat}
        bg={colors[i % colors.length]}
        style={{ cursor: 'pointer', opacity: selected === cat ? 1 : 0.6 }}
        onClick={() => onSelect(cat)}
        className="me-2"
      >
        {cat}
      </Badge>
    ))}
  </Form>
);

export default CategoryFilter;