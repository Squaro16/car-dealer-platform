import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface LeadNotificationEmailProps {
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    leadMessage: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleId: string;
}

export const LeadNotificationEmail = ({
    leadName,
    leadEmail,
    leadPhone,
    leadMessage,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleId,
}: LeadNotificationEmailProps) => {
    const previewText = `New Lead for ${vehicleYear} ${vehicleMake} ${vehicleModel}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            New Vehicle Inquiry
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            You have received a new lead for:
                        </Text>
                        <Section className="bg-gray-100 p-4 rounded-md mb-4">
                            <Text className="text-black text-[16px] font-bold m-0">
                                {vehicleYear} {vehicleMake} {vehicleModel}
                            </Text>
                            <Text className="text-gray-500 text-[12px] m-0 mt-1">
                                ID: {vehicleId}
                            </Text>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>Customer Details:</strong>
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Name: {leadName}
                            <br />
                            Email: {leadEmail}
                            <br />
                            Phone: {leadPhone}
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            <strong>Message:</strong>
                            <br />
                            {leadMessage}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default LeadNotificationEmail;
