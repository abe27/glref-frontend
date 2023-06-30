import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

const BreadcrumbExample = ({ link = [] }) => {
  return (
    <Breadcrumb>
      {link?.map((i) => (
        <BreadcrumbItem key={i.name} isCurrentPage={i.active}>
          <BreadcrumbLink href={i.href}>{i.name}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbExample;
