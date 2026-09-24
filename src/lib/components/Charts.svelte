<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent } from '$lib/data';
  import { fmtDuration, fmtYears } from '$lib/utils/dates';
  import { careerMonths, categoryStrength, computeSkillStats, growthSeries, monthsPerRole, topSkills } from '$lib/utils/derive';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';
  import RadarChart from './charts/RadarChart.svelte';
  import BarChart from './charts/BarChart.svelte';
  import DonutChart from './charts/DonutChart.svelte';
  import AreaChart from './charts/AreaChart.svelte';
  import DataTable from './charts/DataTable.svelte';

  const c = $derived(getContent(app.locale));
  const stats = computeSkillStats();
  const strength = categoryStrength(stats);
  const top = topSkills(stats, 10);
  const perRole = monthsPerRole();
  const growth = growthSeries(stats);
  const total = careerMonths();

  const radarLabels = $derived(strength.map((s) => c.categories[s.id]));
  const radarValues = strength.map((s) => s.value);
  const radarTips = $derived(strength.map((s) => ({ text: c.categories[s.id], sub: `${s.value} / 100` })));
  const bars = $derived(
    top.map((s) => ({
      label: c.skillLabels[s.name] ?? s.name,
      value: s.months,
      display: `${fmtYears(s.months)} ${c.ui.units.years}`,
      sub: fmtDuration(s.months, c.ui.units)
    }))
  );
  const donut = $derived(perRole.map((r) => ({ label: r.company, value: r.months, display: fmtDuration(r.months, c.ui.units) })));
  const area = $derived(
    growth.map((g) => ({
      year: g.year,
      total: g.total,
      sub: Object.entries(g.perCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, v]) => `${c.categories[k as keyof typeof c.categories]} ${v}`)
        .join(', ')
    }))
  );
</script>

<section class="section">
  <div class="container">
    <SectionHead section="insights" slug="insights" title={c.ui.charts.title} intro={c.ui.charts.intro} />
    <div class="grid">
      <article class="card glass ring" use:reveal>
        <h3>{c.ui.charts.radarTitle}</h3>
        <p>{c.ui.charts.radarDesc}</p>
        <RadarChart labels={radarLabels} values={radarValues} tips={radarTips} label={c.ui.charts.radarTitle} />
        <DataTable caption={c.ui.charts.radarTitle} rows={strength.map((x, i) => [radarLabels[i], `${x.value} / 100`])} />
      </article>
      <article class="card glass ring" use:reveal={{ delay: 100 }}>
        <h3>{c.ui.charts.barsTitle}</h3>
        <p>{c.ui.charts.barsDesc}</p>
        <BarChart items={bars} label={c.ui.charts.barsTitle} />
        <DataTable caption={c.ui.charts.barsTitle} rows={bars.map((b) => [b.label, b.sub])} />
      </article>
      <article class="card glass ring" use:reveal>
        <h3>{c.ui.charts.donutTitle}</h3>
        <p>{c.ui.charts.donutDesc}</p>
        <DonutChart items={donut} centerValue={fmtDuration(total, c.ui.units)} centerLabel={c.ui.charts.donutTotal} label={c.ui.charts.donutTitle} />
        <DataTable caption={c.ui.charts.donutTitle} rows={donut.map((d) => [d.label, d.display])} />
      </article>
      <article class="card glass ring" use:reveal={{ delay: 100 }}>
        <h3>{c.ui.charts.growthTitle}</h3>
        <p>{c.ui.charts.growthDesc}</p>
        <AreaChart points={area} label={c.ui.charts.growthTitle} />
        <DataTable caption={c.ui.charts.growthTitle} rows={area.map((a) => [String(a.year), `${a.total} ${c.ui.charts.skillsUsed}`])} />
      </article>
    </div>
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  .card {
    padding: clamp(1rem, 2.5vw, 1.4rem);
    display: grid;
    gap: 0.4rem;
    align-content: start;
  }
  .card h3 {
    font-family: var(--mono);
    font-size: 0.98rem;
    letter-spacing: -0.02em;
  }
  .card h3::before {
    content: '> ';
    color: var(--accent-text);
  }
  .card p {
    color: var(--muted);
    font-size: 0.88rem;
    margin-bottom: 0.4rem;
  }
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
