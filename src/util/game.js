export const GenerateUserGameScore = (origin_score, pos, total_time, solved_time, first_solve_time) => {
	total_time = total_time - first_solve_time
	solved_time = solved_time - first_solve_time
	var step_score = parseInt(100.000 + ((origin_score-100)*(1.000-((solved_time)/(total_time)))))

	if (pos == 1) {
		step_score += parseInt((step_score) * 0.3)
	} else if (pos == 2) {
		step_score += parseInt((step_score) * 0.1)
	} else if (pos == 3) {
		step_score += parseInt((step_score) * 0.05)
	}
	return step_score
}