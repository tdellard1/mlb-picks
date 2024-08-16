// https://www.fangraphs.com/guts.aspx?type=cn

export class WeightedFactors {
  // Season	 wOBA	  wOBAScale	  wBB	  wHBP	  w1B	  w2B	  w3B	  wHR	  runSB	runCS	R/PA	R/W	  cFIP
  // 2024	   .309	  1.255	      .691	.722	  .886	1.262	1.601	2.066	.200	-.403	.117	9.647	3.160
  public static wOBA: number = 0.311; // league wOBA
  public static wOBAScale: number = 1.236;
  public static wBB: number = 0.690;
  public static wHBP: number = 0.721;
  public static w1B: number = 0.882;
  public static w2B: number = 1.253;
  public static w3B: number = 1.587;
  public static wHR: number = 2.042;
  public static RoPA: number = .118;
}
/*
"Season", "2024",
"wOBA", ".311",
"wOBAScale", "1.238",
"wBB", ".690",
"wHBP", ".721",
"w1B", ".882",
"w2B", "1.253",
"w3B", "1.587",
"wHR", "2.044",
"runSB", ".200",
"runCS", "-.408",
"R/PA", ".118",
"R/W", "9.738",
"cFIP" "3.174"
*/