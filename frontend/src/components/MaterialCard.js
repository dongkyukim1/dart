import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const Icon = styled.div`
  font-size: 1.5rem;
  color: white;
`;

const CardTitle = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #2d3748;
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
`;

const CardContent = styled.div`
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-family: 'Pretendard-Regular', sans-serif;
  color: #718096;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f7fafc;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const StatusBadge = styled.span`
  background: ${props => props.status === 'active' ? '#48bb78' : '#ed8936'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 0.7rem;
`;

const MaterialCard = ({ 
  icon, 
  title, 
  description, 
  gradient,
  status,
  buttonText = "바로가기",
  onButtonClick,
  children 
}) => {
  return (
    <CardContainer>
      <CardHeader>
        <IconContainer gradient={gradient}>
          <Icon>{icon}</Icon>
        </IconContainer>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <CardDescription>{description}</CardDescription>
        {children}
      </CardContent>
      
      <CardFooter>
        {status && <StatusBadge status={status}>{status === 'active' ? '사용가능' : '준비중'}</StatusBadge>}
        <ActionButton onClick={onButtonClick}>
          {buttonText}
        </ActionButton>
      </CardFooter>
    </CardContainer>
  );
};

export default MaterialCard;
