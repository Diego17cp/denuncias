import { TrackingData } from "../../types";
import { getStatusColor } from "../../utils";
interface TimeLineProps {
	trackingUtils: {
		trackingData: TrackingData | null;
		getStatusIcon: (status: string) => string;
		formatDate: (date: string) => string;
		getGlowColorFromStatus: (status: string) => string;
	};
}

export const TimeLine = ({ trackingUtils }: TimeLineProps) => {
	const {
		trackingData,
		getStatusIcon,
		formatDate,
		getGlowColorFromStatus,
	} = trackingUtils;

	return (
		trackingData?.data && (
			<div className="relative">
				{trackingData.data.length > 1 && (
					<div className="absolute left-8 top-6 bottom-0 w-0.5 bg-gradient-to-b from-(--primary-color) to-gray-200"></div>
				)}
				<div className="space-y-8">
					{trackingData.data.map((tracking, index) => {
						const statusColor = getStatusColor(tracking.estado);
						const statusIcon = getStatusIcon(tracking.estado);
						const isFirst = index === 0;
						return (
							// Contenedor
							<div
								key={tracking.id}
								className={`relative pl-16 animate-fadeIn`}
								style={{ animationDelay: `${index * 150}ms` }}
							>
								{/* icono */}
								<div
									className={`absolute left-[18px] top-3 w-8 h-8 rounded-full flex items-center justify-center ${
										statusColor.split(" ")[0]
									} border-2 ${statusColor.split(" ")[2]}`}
								>
									<i
										className={`fa-solid ${statusIcon} text-sm ${
											statusColor.split(" ")[1]
										}`}
									></i>
								</div>
								<div
									className={`bg-transparent rounded-lg p-5 shadow-md border-l-4 ${
										statusColor.split(" ")[2]
									} ${isFirst ? "animate-glowShadow" : ""}`}
									style={
										isFirst
											? ({
													"--glow-color-rgb":
														getGlowColorFromStatus(
															tracking.estado.toLowerCase()
														),
											  } as React.CSSProperties)
											: {}
									}
								>
									<div className="flex justify-between items-center mb-3">
										<h3 className="text-lg font-semibold capitalize">
											{tracking.estado.replace(/_/g, " ")}
										</h3>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
										>
											{isFirst ? "Actual" : "Anterior"}
										</span>
									</div>
									<p className="text-gray-600 mb-3 whitespace-pre-line">
										{tracking.comentario}
									</p>
									<div className="flex items-center text-sm text-gray-500">
										<i className="fa-regular fa-calendar-check mr-2"></i>
										<time>
											{formatDate(
												tracking.created_at || tracking.fecha_actualizacion
											)}
										</time>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		)
	);
};
